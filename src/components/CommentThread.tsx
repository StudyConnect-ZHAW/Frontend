'use client';

import { useState } from 'react';
import { Comment } from '@/types/comment';
import { useTranslation } from 'react-i18next';
import CommentInput from '@/components/CommentInput';
import { createComment } from '@/lib/handlers/commentHandler';

interface Props {
  comment: Comment;
  depth: number;
  postId: string;
  onCommentsUpdated: () => void;
}

export default function CommentThread({ comment, depth, postId, onCommentsUpdated }: Props) {
  const { i18n } = useTranslation();
  const [showReply, setShowReply] = useState(false);

  const createdAt = new Date(comment.created);
  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(createdAt);

  return (
    <div className={`ml-${Math.min(depth * 4, 20)} border-l border-gray-600 pl-4`}>
      <div className="text-sm text-primary bg-sidebar-bg rounded-md p-3 shadow-sm">
        <div className="mb-1 text-xs text-gray-500">
          {formattedDate} • {comment.user.firstName} {comment.user.lastName}
        </div>
        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>

        {/* Reply toggle button */}
        <button
          onClick={() => setShowReply((prev) => !prev)}
          className="text-xs text-blue-600 hover:underline mt-2"
        >
          {showReply ? 'Cancel' : 'Reply'}
        </button>

        {/* Reply input box */}
        {showReply && (
          <CommentInput
            onSubmit={async (text) => {
              await createComment(postId, {
                parentCommentId: comment.forumCommentId,
                content: text,
              });
              setShowReply(false);
              onCommentsUpdated();
            }}
          />
        )}
      </div>

      {/* Children comments */}
      {comment.replies?.map((child: Comment) => (
        <CommentThread
          key={child.forumCommentId}
          comment={child}
          depth={depth + 1}
          postId={postId}
          onCommentsUpdated={onCommentsUpdated}
        />
      ))}
    </div>
  );
}