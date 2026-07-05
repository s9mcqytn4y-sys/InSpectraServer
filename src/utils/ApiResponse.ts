export interface ApiResponse<T> {
	status: "success" | "error" | "fail";
	metadata: {
		timestamp: string;
		count?: number;
	};
	data?: T;
	message?: string;
}

export const successResponse = <T>(
	data: T,
	metadataOptions?: { count?: number },
): ApiResponse<T> => {
	return {
		status: "success",
		metadata: {
			timestamp: new Date().toISOString(),
			...metadataOptions,
		},
		data,
	};
};

export const errorResponse = (message: string): ApiResponse<null> => {
	return {
		status: "error",
		metadata: {
			timestamp: new Date().toISOString(),
		},
		message,
	};
};
