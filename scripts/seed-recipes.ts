import type { RecipeSeedInput } from "../src/services/recipe.service";

interface ProcessWithBuiltinModule {
  getBuiltinModule?: (id: string) => unknown;
}

interface V8BuiltinModule {
  startupSnapshot?: {
    isBuildingSnapshot?: () => boolean;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isV8BuiltinModule(value: unknown): value is V8BuiltinModule {
  return isRecord(value);
}

function applyBunBsonFallback(): void {
  const currentProcess = process as unknown as ProcessWithBuiltinModule;
  const getBuiltinModule = currentProcess.getBuiltinModule?.bind(process);

  if (!getBuiltinModule) {
    return;
  }

  currentProcess.getBuiltinModule = (id: string): unknown => {
    const builtinModule = getBuiltinModule(id);

    if (id !== "v8" || !isV8BuiltinModule(builtinModule)) {
      return builtinModule;
    }

    // Bun's snapshot detection can interfere with BSON during seeding, so we force it off here.
    return {
      ...builtinModule,
      startupSnapshot: {
        ...builtinModule.startupSnapshot,
        isBuildingSnapshot: () => false,
      },
    };
  };
}

const cloudinaryFoodBaseUrl = "https://res.cloudinary.com/demo/image/upload";

function cloudinaryFoodImage(publicId: string): string {
  return `${cloudinaryFoodBaseUrl}/c_fill,w_1200,h_900,q_auto,f_auto/${publicId}`;
}

const recipes: RecipeSeedInput[] = [
  {
    title: "Pescado al horno con vegetales",
    image: cloudinaryFoodImage("samples/food/fish-vegetables"),
    prepTime: "35 min",
    difficulty: "Fácil",
    servings: "4 porciones",
    ingredients: [
      "4 filetes de pescado blanco",
      "1 zucchini en medias lunas",
      "1 pimentón rojo en tiras",
      "1 cebolla morada en plumas",
      "2 cucharadas de aceite de oliva",
      "1 limón",
      "Sal y pimienta al gusto",
    ],
    steps: [
      "Precalienta el horno a 200 grados Celsius.",
      "Mezcla los vegetales con aceite de oliva, sal y pimienta.",
      "Ubica los filetes sobre una bandeja y añade jugo de limón.",
      "Rodea el pescado con los vegetales y hornea durante 20 a 25 minutos.",
      "Sirve caliente con arroz blanco o papas al vapor.",
    ],
  },
  {
    title: "Mejillones en salsa de tomate",
    image: cloudinaryFoodImage("samples/food/pot-mussels"),
    prepTime: "30 min",
    difficulty: "Media",
    servings: "4 porciones",
    ingredients: [
      "1 kg de mejillones limpios",
      "2 tazas de tomate triturado",
      "3 dientes de ajo picados",
      "1 cebolla blanca picada",
      "1/2 taza de vino blanco",
      "2 cucharadas de aceite de oliva",
      "Perejil fresco al gusto",
    ],
    steps: [
      "Sofrie la cebolla y el ajo en aceite de oliva hasta que estén transparentes.",
      "Agrega el tomate triturado y cocina la salsa durante 10 minutos.",
      "Añade el vino blanco y deja reducir durante 3 minutos.",
      "Incorpora los mejillones, tapa la olla y cocina hasta que se abran.",
      "Termina con perejil fresco y sirve con pan tostado.",
    ],
  },
  {
    title: "Curry de garbanzos con especias",
    image: cloudinaryFoodImage("samples/food/spices"),
    prepTime: "40 min",
    difficulty: "Fácil",
    servings: "4 porciones",
    ingredients: [
      "2 tazas de garbanzos cocidos",
      "1 taza de leche de coco",
      "1 taza de tomate triturado",
      "1 cebolla blanca picada",
      "2 dientes de ajo picados",
      "1 cucharada de curry en polvo",
      "1 cucharadita de comino",
      "Cilantro fresco al gusto",
    ],
    steps: [
      "Sofrie la cebolla y el ajo hasta que suelten aroma.",
      "Agrega el curry y el comino, y cocina durante 1 minuto.",
      "Incorpora el tomate triturado y cocina durante 8 minutos.",
      "Añade los garbanzos y la leche de coco.",
      "Cocina a fuego medio durante 15 minutos y termina con cilantro fresco.",
    ],
  },
  {
    title: "Postre de frutos rojos con crema",
    image: cloudinaryFoodImage("samples/food/dessert"),
    prepTime: "20 min",
    difficulty: "Fácil",
    servings: "6 porciones",
    ingredients: [
      "2 tazas de frutos rojos",
      "1 taza de crema para batir",
      "3 cucharadas de azúcar pulverizada",
      "1 cucharadita de esencia de vainilla",
      "8 galletas de mantequilla trituradas",
      "Hojas de menta para decorar",
    ],
    steps: [
      "Bate la crema con azúcar pulverizada y vainilla hasta formar picos suaves.",
      "Distribuye las galletas trituradas en vasos individuales.",
      "Agrega una capa de crema batida y otra de frutos rojos.",
      "Repite las capas y refrigera durante 10 minutos.",
      "Decora con hojas de menta antes de servir.",
    ],
  },
  {
    title: "Pasta cremosa con champiñones",
    image: cloudinaryFoodImage("samples/food/pot-mussels"),
    prepTime: "25 min",
    difficulty: "Fácil",
    servings: "4 porciones",
    ingredients: [
      "400 g de pasta corta",
      "250 g de champiñones laminados",
      "1 taza de crema de leche",
      "2 dientes de ajo picados",
      "1/2 taza de queso parmesano rallado",
      "2 cucharadas de mantequilla",
      "Sal y pimienta al gusto",
    ],
    steps: [
      "Cocina la pasta en agua con sal hasta que esté al dente.",
      "Dora los champiñones en mantequilla hasta que pierdan humedad.",
      "Agrega el ajo y cocina durante 1 minuto.",
      "Incorpora la crema y el parmesano hasta formar una salsa suave.",
      "Mezcla con la pasta y ajusta sal y pimienta antes de servir.",
    ],
  },
  {
    title: "Ensalada tibia de quinoa y vegetales",
    image: cloudinaryFoodImage("samples/food/fish-vegetables"),
    prepTime: "30 min",
    difficulty: "Fácil",
    servings: "3 porciones",
    ingredients: [
      "1 taza de quinoa lavada",
      "2 tazas de agua",
      "1 zanahoria en cubos",
      "1 taza de brócoli en floretes",
      "1/2 taza de maíz dulce",
      "2 cucharadas de aceite de oliva",
      "Jugo de 1 limón",
      "Sal al gusto",
    ],
    steps: [
      "Cocina la quinoa en agua con sal durante 15 minutos.",
      "Saltea la zanahoria, el brócoli y el maíz con aceite de oliva.",
      "Mezcla la quinoa cocida con los vegetales calientes.",
      "Añade jugo de limón y ajusta la sal.",
      "Sirve tibia como plato principal ligero o acompañamiento.",
    ],
  },
  {
    title: "Pollo salteado con especias",
    image: cloudinaryFoodImage("samples/food/spices"),
    prepTime: "28 min",
    difficulty: "Media",
    servings: "4 porciones",
    ingredients: [
      "600 g de pechuga de pollo en tiras",
      "1 pimentón amarillo en tiras",
      "1 cebolla roja en plumas",
      "2 cucharadas de salsa de soya",
      "1 cucharadita de paprika",
      "1/2 cucharadita de comino",
      "2 cucharadas de aceite vegetal",
    ],
    steps: [
      "Sazona el pollo con paprika, comino y salsa de soya.",
      "Calienta el aceite en una sartén amplia.",
      "Dora el pollo por tandas para que conserve sus jugos.",
      "Agrega la cebolla y el pimentón, y saltea durante 5 minutos.",
      "Sirve con arroz, tortillas o ensalada fresca.",
    ],
  },
  {
    title: "Tarta rápida de frutas",
    image: cloudinaryFoodImage("samples/food/dessert"),
    prepTime: "45 min",
    difficulty: "Media",
    servings: "8 porciones",
    ingredients: [
      "1 base de masa quebrada",
      "2 tazas de crema pastelera",
      "1 taza de fresas en láminas",
      "1 kiwi en rodajas",
      "1/2 taza de arándanos",
      "2 cucharadas de mermelada de albaricoque",
    ],
    steps: [
      "Hornea la base de masa quebrada según las instrucciones del empaque.",
      "Deja enfriar la base antes de rellenar.",
      "Extiende la crema pastelera en una capa uniforme.",
      "Acomoda las frutas sobre la crema.",
      "Pincela con mermelada tibia para dar brillo y refrigera antes de servir.",
    ],
  },
];

async function main(): Promise<void> {
  applyBunBsonFallback();

  const { seedRecipes } = await import("../src/services/recipe.service");

  await seedRecipes(recipes);
  console.log(`Seed completado: ${recipes.length} recetas listas para probar.`);
}

main()
  .catch((error: unknown) => {
    const message =
      error instanceof Error
        ? error.message
        : "No pudimos cargar las recetas de prueba.";

    console.error(message);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = await import("mongoose");

    await mongoose.default.disconnect();
  });
