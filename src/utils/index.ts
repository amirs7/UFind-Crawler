import axios from 'axios';

async function loadUrl(url: string) {
    try {
        const response = await axios.get(url, {timeout: 5000});
        console.log(`${url} fetched!`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

async function loadUFindUrl(id: number) {
    let url = `https://ufind.univie.ac.at/en/vvz_sub.html?path=${id}`;
    return await loadUrl(url);
}

export {
    loadUrl,
    loadUFindUrl
}

