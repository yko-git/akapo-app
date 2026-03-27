import { Category } from "@/shared/schemas";

// Navigation
export interface NavProps {
  onLinkClick?: () => void;
}

// Photo/Image
export interface PhotoProps {
  src: string;
  alt: string;
}

export interface PhotoListProps extends PhotoProps {
  width: number;
  height: number;
}

// SelectBox
export interface SelectBoxProps {
  options: { value: string; label: string }[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
}

// Comment
export interface CommentListProps {
  postUserId: number;
  postId: number;
}

export interface CreateCommentProps {
  postId: number;
}

export interface PostDetailProps {
  id: number;
}

// Tag
export interface TagListProps {
  categories: Pick<Category, "name">[];
}
