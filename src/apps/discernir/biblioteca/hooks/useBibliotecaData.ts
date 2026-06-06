import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { downscaleToDataURL, uploadPageImage } from '../utils/bibliotecaImage';

export interface EccFolder {
  id: string;
  name: string;
  kind: 'geral' | 'equipe' | 'outro';
  sort_order: number;
}
export interface EccDocument {
  id: string;
  folder_id: string | null;
  title: string;
  description: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
export interface EccPage {
  id: string;
  document_id: string;
  page_number: number;
  image_path: string | null;
  transcription: string | null;
  notes: string | null;
  status: 'pending' | 'transcribed' | 'reviewed';
}

// ---------- Pastas ----------
export function useBibliotecaFolders() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ['ecc', 'folders'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('ecc_folders')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });
      if (error) throw error;
      return (data || []) as EccFolder[];
    },
  });
  const addFolder = async (name: string, kind: EccFolder['kind'] = 'geral') => {
    const { error } = await (supabase as any)
      .from('ecc_folders')
      .insert({ name: name.trim(), kind, created_by: user?.id });
    if (error) throw error;
    await qc.invalidateQueries({ queryKey: ['ecc', 'folders'] });
  };
  return { folders: query.data ?? [], isLoading: query.isLoading, addFolder };
}

// ---------- Documentos ----------
export function useBibliotecaDocuments(folderId: string | null) {
  const qc = useQueryClient();
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ['ecc', 'documents', folderId],
    enabled: !!folderId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('ecc_documents')
        .select('*')
        .eq('folder_id', folderId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []) as EccDocument[];
    },
  });
  const addDocument = async (title: string, description?: string) => {
    const { data, error } = await (supabase as any)
      .from('ecc_documents')
      .insert({ folder_id: folderId, title: title.trim(), description: description?.trim() || null, created_by: user?.id })
      .select()
      .single();
    if (error) throw error;
    await qc.invalidateQueries({ queryKey: ['ecc', 'documents', folderId] });
    return data as EccDocument;
  };
  return { documents: query.data ?? [], isLoading: query.isLoading, addDocument };
}

export function useBibliotecaDocument(documentId: string | null) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ['ecc', 'document', documentId],
    enabled: !!documentId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('ecc_documents')
        .select('*')
        .eq('id', documentId)
        .maybeSingle();
      if (error) throw error;
      return data as EccDocument | null;
    },
  });
  const updateDocument = async (patch: Partial<EccDocument>) => {
    const { error } = await (supabase as any)
      .from('ecc_documents')
      .update(patch)
      .eq('id', documentId);
    if (error) throw error;
    await qc.invalidateQueries({ queryKey: ['ecc', 'document', documentId] });
  };
  return { document: query.data ?? null, isLoading: query.isLoading, updateDocument };
}

// ---------- Paginas ----------
export function useBibliotecaPages(documentId: string | null) {
  const qc = useQueryClient();
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ['ecc', 'pages', documentId],
    enabled: !!documentId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('ecc_pages')
        .select('*')
        .eq('document_id', documentId)
        .order('page_number', { ascending: true });
      if (error) throw error;
      return (data || []) as EccPage[];
    },
  });
  const invalidate = () => qc.invalidateQueries({ queryKey: ['ecc', 'pages', documentId] });

  // Tira foto -> sobe pro storage -> transcreve com IA -> salva pagina.
  // Se a transcricao falhar, a pagina e salva mesmo assim (status pending).
  const capturePage = async (file: File) => {
    if (!documentId) throw new Error('Sem documento');
    const dataUrl = await downscaleToDataURL(file);
    const pageNumber = (query.data?.length ?? 0) + 1;
    const path = `${documentId}/${pageNumber}-${Date.now()}.jpg`;
    await uploadPageImage(path, dataUrl);

    let transcription = '';
    let status: EccPage['status'] = 'pending';
    try {
      const { data, error } = await supabase.functions.invoke('ecc-transcribe-page', {
        body: { image: dataUrl },
      });
      if (!error && data?.success) {
        transcription = data.transcription || '';
        status = transcription ? 'transcribed' : 'pending';
      }
    } catch (_e) {
      // mantem pending; usuario pode tentar transcrever depois
    }

    const { error: insErr } = await (supabase as any).from('ecc_pages').insert({
      document_id: documentId,
      page_number: pageNumber,
      image_path: path,
      transcription,
      status,
      created_by: user?.id,
    });
    if (insErr) throw insErr;
    await invalidate();
    return { transcribed: status === 'transcribed' };
  };

  const updatePage = async (id: string, patch: Partial<EccPage>) => {
    const { error } = await (supabase as any).from('ecc_pages').update(patch).eq('id', id);
    if (error) throw error;
    await invalidate();
  };

  const retranscribe = async (page: EccPage, dataUrl: string) => {
    const { data, error } = await supabase.functions.invoke('ecc-transcribe-page', {
      body: { image: dataUrl },
    });
    if (error) throw error;
    if (!data?.success) throw new Error(data?.error || 'Falha ao transcrever');
    await updatePage(page.id, { transcription: data.transcription, status: 'transcribed' });
  };

  const deletePage = async (id: string) => {
    const { error } = await (supabase as any).from('ecc_pages').delete().eq('id', id);
    if (error) throw error;
    await invalidate();
  };

  return {
    pages: query.data ?? [],
    isLoading: query.isLoading,
    capturePage,
    updatePage,
    retranscribe,
    deletePage,
  };
}
