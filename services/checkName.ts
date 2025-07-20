// utils/checkName.ts

export const checkName = (name: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (name === "Pedro") {
      resolve("✅ Correct! Name is " + name);
    } else {
      reject("❌ Name was not Pedro. It was " + name);
    }
  });
};
