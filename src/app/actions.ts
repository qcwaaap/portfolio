'use server'; 

export async function greet(name: string) {
  const timestamp = new Date().toISOString();
  return `hi, ${name}! server's time: ${timestamp}`;
}
