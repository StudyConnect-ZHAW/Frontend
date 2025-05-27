'use client';

import { Comment } from '@/types/comment';
import { useTranslation } from 'react-i18next';

interface Props {
  comment: Comment;
  depth: number;
}

export default function CommentThread({ comment, depth }: Props) {
  const { i18n } = useTranslation();

  const createdAt = new Date(comment.createdAt + 'Z');
  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(createdAt);

  return (
    <div className={`ml-${depth * 4} border-l border-gray-600 pl-4`}>
      <div className="text-sm text-primary bg-sidebar-bg rounded-md p-3 shadow-sm">
        <div className="mb-1 text-xs text-gray-500">
          {formattedDate} • {comment.author.firstName} {comment.author.lastName}
        </div>
        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
        {/* Add reply/like buttons here */}
      </div>

      {comment.children?.map((child: Comment) => (
        <CommentThread key={child.id} comment={child} depth={depth + 1} />
      ))}
    </div>
  );
}