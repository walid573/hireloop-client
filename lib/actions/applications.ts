const BaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';


export const updateApplicationStatus = async (id: string, data: { status: string }) => {
    const response = await fetch(`${BaseUrl}/applications/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json()
}