import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { Comment, Post } from "../../utils/pub-sub";

export async function getPost(app: FastifyInstance) {
    app.get('/posts/:postId', async (request, reply) => {
        const getPostParams = z.object({
            postId: z.string().uuid(),
        })
        const { postId } = getPostParams.parse(request.params)
        const post: Post | null = await prisma.post.findUnique({
            where: {
                id: postId,
            },
            include: {
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                state: true,
                                registeredAt: true,
                                beeKeeper: true,
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        state: true,
                        registeredAt: true,
                        beeKeeper: true,
                    }
                }
            }
        })
        if (!post) {
            throw new Error("Postagem não encontrado")
        }
        if (post.comments) {
            const orderedComments = organizeComments(post.comments);
            const orderedPost = {
                ...post,
                comments: orderedComments
            }
            return reply.status(201).send(orderedPost)
        }
        return reply.status(201).send(post)
    })
}

function organizeComments(comments: Comment[]): Comment[] {
    const commentMap: { [id: string]: Comment } = {}
    const rootComments: Comment[] = []
    // Create a map of comments using their IDs as keys
    comments.forEach(comment => {
        commentMap[comment.id] = comment
    })
    comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    // Organize comments into hierarchical structure
    comments.forEach(comment => {
        if (comment.parentCommentId !== null && comment.parentCommentId !== undefined) {
            const parentComment = commentMap[comment.parentCommentId]
            if (parentComment) {
                if (!parentComment.replies) {
                    parentComment.replies = []
                }
                parentComment.replies.push(comment)
            }
        } else {
            rootComments.push(comment)
        }
    })
    return rootComments
}
