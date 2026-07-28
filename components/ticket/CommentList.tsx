import { prisma } from "@/lib/prisma";

interface Props {
  ticketId: string;
}

export default async function CommentList({ ticketId }: Props) {
  const comments = await prisma.comment.findMany({
    where: {
      ticketId,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (comments.length === 0) {
    return (
      <div className="rounded-md border p-4 text-sm text-muted-foreground">
        No comments yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="rounded-md border p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{comment.user.name}</span>

            <span className="text-sm text-muted-foreground">
              {comment.createdAt.toLocaleString()}
            </span>
          </div>

          <p className="mt-2 whitespace-pre-wrap">
            {comment.message}
          </p>
        </div>
      ))}
    </div>
  );
}