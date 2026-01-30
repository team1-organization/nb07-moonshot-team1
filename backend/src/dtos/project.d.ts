declare global {
    interface Project {
        id: bigint;
        user_id: bigint;
        title: string;
        description: string;
        created_at: Date;
        updated_at: Date;

        user?: any;   
        tasks?: any[]; 
        Member?: any[];
    }

    interface CreateProjectInput {
        user_id: bigint;
        title: string;
        description: string;
    }
}

export {};