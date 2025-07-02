// This is a sample service file.
// Services are used to encapsulate business logic.

export const getSampleData = async (): Promise<{ message: string }> => {
    // In a real application, this could be a database call.
    return { message: 'This is sample data from the service.' };
}; 