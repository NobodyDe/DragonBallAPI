export async function retryOperation(asyncFn, retries = 4, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await asyncFn();
    } catch (error) {
      if (i === retries - 1) {
        console.error(`Falha após ${retries} tentativas:`, error);
        throw error;
      }

      console.warn(
        `Tentativa ${i + 1} falhou. Tentando novamente em ${delay}ms...`
      );
      await new Promise((resolve) => setInterval(resolve, delay));
    }
  }
}
