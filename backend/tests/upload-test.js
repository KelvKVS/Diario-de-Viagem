const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

/**
 * Script para testar o upload de imagens para o endpoint de criação de viagens
 */

// Configurações
const API_URL = 'http://localhost:3000/api/trips';
const IMAGE_PATH = path.join(__dirname, 'test-image.jpg'); // Certifique-se de que este arquivo exista
const TOKEN = 'SEU_TOKEN_JWT_AQUI'; // Substitua pelo token JWT válido

// Função para criar uma imagem de teste se ela não existir
const createTestImage = () => {
  if (!fs.existsSync(IMAGE_PATH)) {
    // Criar um arquivo de imagem de teste simples
    // Este é um pequeno arquivo JPG válido
    const minimalJpg = Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 
      0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 
      0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 
      0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 
      0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 
      0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 
      0xff, 0xff, 0xff, 0xff, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01, 0x00, 
      0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x14, 0x00, 0x01, 0x00, 
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
      0x00, 0x00, 0x00, 0xff, 0xc4, 0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
      0x00, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00, 0x37, 
      0xff, 0xd9
    ]);
    
    fs.writeFileSync(IMAGE_PATH, minimalJpg);
    console.log(`Arquivo de teste criado: ${IMAGE_PATH}`);
  } else {
    console.log(`Usando arquivo de teste existente: ${IMAGE_PATH}`);
  }
};

// Função para realizar o teste de upload
const testUpload = async () => {
  try {
    console.log('Iniciando teste de upload...');
    
    // Criar imagem de teste se necessário
    createTestImage();
    
    // Criar FormData
    const form = new FormData();
    form.append('name', 'Viagem de Teste');
    form.append('description', 'Esta é uma viagem de teste para verificar o upload de imagens');
    form.append('isPublic', 'true');
    
    // Adicionar imagem ao FormData
    const fileStream = fs.createReadStream(IMAGE_PATH);
    form.append('coverImage', fileStream, {
      filename: 'test-image.jpg',
      contentType: 'image/jpeg',
    });
    
    console.log('FormData preparado');
    
    // Configurar headers
    const headers = {
      ...form.getHeaders(),
      'Authorization': `Bearer ${TOKEN}`,
    };
    
    // Fazer requisição
    console.log('Enviando requisição...');
    const response = await axios.post(API_URL, form, { headers });
    
    console.log('Resposta recebida:');
    console.log('Status:', response.status);
    console.log('Dados:', JSON.stringify(response.data, null, 2));
    
    // Verificar se a imagem foi salva
    if (response.data && response.data.coverImage) {
      console.log('✅ Imagem enviada com sucesso!');
      console.log('Caminho da imagem:', response.data.coverImage);
    } else {
      console.log('❌ A imagem não foi enviada ou não foi salva corretamente');
    }
    
  } catch (error) {
    console.error('Erro no teste de upload:');
    if (error.response) {
      // Erro da API
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // Erro de rede
      console.error('Erro de rede - sem resposta:', error.message);
    } else {
      // Outro erro
      console.error('Erro:', error.message);
    }
    console.error('Stack:', error.stack);
  }
};

// Executar o teste
testUpload(); 