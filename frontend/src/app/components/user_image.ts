export async function GetUserImage(id: number): Promise<string | null> {
    let imgData: string | null = null;
    await fetch(`http://localhost:8080/user/profile/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // This is the key to include cookies
        body: JSON.stringify({ user_id: id })
    }).then(async (imgRes) => {
        if (imgRes.ok) {
            await imgRes.json().then(imgJson => {
                if (imgJson.user.image_url) {
                    imgData = "data:image/jpeg;base64," + imgJson.user.image_url;
                }
            })
        }
    });
    return imgData;
}