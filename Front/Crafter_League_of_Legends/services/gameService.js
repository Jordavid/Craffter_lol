import axios from "axios";
import { API_CONFIG } from "../constants/theme";

const api = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

function adaptBackendResponse(backendData) {
    
    // Transformar targetItem
    const targetItem = {
        id: backendData.targetItemId,
        name: backendData.targetItemName,
        imageUrl: backendData.targetItemImageUrl,
    };

    // Transformar options - cambiar itemId a id
    const options = backendData.options.map(item => ({
        id: item.itemId,
        name: item.name,
        imageUrl: item.imageUrl,
        cost: item.cost,
    }));

    // Transformar correctComponents si existe
    const correctComponents = backendData.correctComponents?.map(item => ({
        id: item.itemId || item.id,
        name: item.name,
        imageUrl: item.imageUrl,
    })) || [];

    // Retornar estructura adaptada
    const adapted = {
        targetItem,
        options,
        correctComponents,
        correctComponentIds: backendData.correctComponentIds,
        timeLimit: backendData.timeLimit,
        difficulty: backendData.difficulty,
    };
    
    return adapted;
}

export const gameService = {
    //Obtener un item aleatorio con sus opciones
    async getRandomItem(){
        try {
            const response = await api.get(API_CONFIG.endpoints.question, {
                params: { difficulty: 'HARD' }
            });

            const adaptedData = adaptBackendResponse(response.data);
            
            return adaptedData;
        } catch (error) {
            console.error('Error fetching random item:', error);
            throw error;
        }
    },

    async validateAnswer(targetItemId, selectedComponentIds){
        try {
            const response = await api.post(API_CONFIG.endpoints.validate, {
                targetItemId, selectedComponentIds
            });

            // Adaptar correctComponents si viene del backend
            const correctComponents = response.data.correctComponents?.map(item => ({
                id: item.itemId || item.id,
                name: item.name,
                imageUrl: item.imageUrl,
            })) || [];

            const result = {
                isCorrect: response.data.correct || false,
                correctComponents: correctComponents,
                message: response.data.message || ''
            };

            return result;

        } catch (error){
            console.error('Error validating answer:', error)
            throw error;
        }
    },
};