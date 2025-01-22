
export type BeeKeeper = {
    id: string;
    city: string;
    phoneNumber: string;
    RG: string;
    CPF: string;
    subscriptionAt: Date;
    userId: string;
};

export type User = {
    id: string;
    name: string;
    email: string;
    state: string;
    registeredAt: Date;
    beeKeeper?: BeeKeeper | null;
};

export type LoggedUser = {
    id: string;
    name: string;
    email: string;
    state: string;
    asfCoins: number,
    asfCash: number,
    registeredAt: Date;
    beeKeeper?: BeeKeeper | null;
};

export type Comment = {
    id: string;
    content: string;
    value: number;
    createdAt: Date;
    postId: string | null;
    replies?: Comment[];
    parentCommentId?: string | null;
    userId: string;
    user: User;
    post?: Post | null;
    parentComment?: Comment | null;
};

export type Post = {
    id: string;
    title: string;
    content: string;
    value: number;
    createdAt: Date;
    option: string;
    comments?: Comment[];
    user: User;
};

export type BeeData = {
    id: string;
    content: string;
    value: number;
    createdAt: Date;
    updatedBy: User[];
    beeId: String;
}

export type Bee = {
    id: string;
    name: string;
    binomialNomenclature: string;
}
export type Message = {
    action: 'create' | 'delete' | 'update' | 'cherish' | 'depreciate';
    type: 'post' | 'comment' | 'bee' | 'beedata';
    data: {
        post?: {},
        postId?: string,
        comment?: {},
        commentId?: string,
        commentCreator?: string,
        userId?: string,
        beeId?: string,
        bee?: Bee,
        beeData?: BeeData,
        updatedBeeData?: BeeData,
    };
};
export type Subscriber = (message: Message) => void;

class PubSub {
    private channels: Record<string, Subscriber[]> = {};

    subscribe(channel: string, subscriber: Subscriber) {
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push(subscriber);
    }

    publish(channel: string, message: Message) {
        if (!this.channels[channel]) {
            return;
        }
        for (const subscriber of this.channels[channel]) {
            subscriber(message);
        }
    }
}

export const pubSub = new PubSub();
