'use client';

import { useState } from 'react';
import { Comment } from '@/types/comment';
import CommentInput from '@/components/CommentInput';
import { createComment } from '@/lib/handlers/commentHandler';
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import { formatRelativeTime } from '@/utils/format';
import { FiMessageCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface Props {
  comment: Comment;
  depth: number;
  postId: string;
  onCommentsUpdated: () => void;
  isLiked: (commentId: string) => boolean;
  onLike: (commentId: string) => void;
}

export default function CommentThread({
  comment,
  depth,
  postId,
  onCommentsUpdated,
  isLiked,
  onLike,
}: Props) {
  const [showReply, setShowReply] = useState(false);

  const { t } = useTranslation(['forum', 'common']);

  const createdAt = new Date(comment.created);
  const relativeDate = formatRelativeTime(createdAt)

  const liked = isLiked(comment.forumCommentId);

  return (
    <div className={`pl-5 border-l border-gray-600`}>
      <div className="pb-2 text-sm">

        {/* Top: User and timestamp */}
        <div className="text-s text-gray-500 mb-1">
          <span className="font-medium text-primary">
            {comment.user.firstName} {comment.user.lastName}
          </span>{" "}
          • {relativeDate}
        </div>

        {/* Middle: Comment text */}
        <div className="text-sm text-primary whitespace-pre-wrap mb-2">
          {comment.content}
        </div>

        {/* Bottom: Actions */}
        <div className="flex items-center gap-4 text-s text-gray-500">
          {/* Like button */}
          <button
            onClick={() => onLike(comment.forumCommentId)}
            className="flex items-center gap-1 hover:text-primary cursor-pointer"
          >
            {liked ? <FaThumbsUp /> : <FaRegThumbsUp />}
            {comment.likeCount}
          </button>

          {/* Reply button */}
          <button
            onClick={() => setShowReply((prev) => !prev)}
            className="flex items-center gap-1 hover:text-primary cursor-pointer"
          >
            <FiMessageCircle />
            {t("button.reply")}
          </button>
        </div>

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

      {/* Recursive replies */}
      {comment.replies?.map((child: Comment) => (
        <CommentThread
          key={child.forumCommentId}
          comment={child}
          depth={depth + 1}
          postId={postId}
          onCommentsUpdated={onCommentsUpdated}
          isLiked={isLiked}
          onLike={onLike}
        />
      ))}
    </div>
  );
}