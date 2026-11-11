import { useParams } from 'react-router';

function parseContentId(value: string | undefined): number | null {
  if (!value || !/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export function useContentId(): number | null {
  const { id } = useParams();
  return parseContentId(id);
}
