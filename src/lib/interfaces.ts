export interface AxiosError {
    response: {
        data: {
            errors: {
                [key: string]: string;
            }
        }
    }
}
