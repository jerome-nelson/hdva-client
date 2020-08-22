function createData(name: string, hasImages: boolean , hasVT: boolean, hasFloorplan: boolean) {
    return { name, hasImages, hasVT, hasFloorplan };
  }
  
export const propertyData = [
    createData('Property 1', true, true, false),
    createData('Property 2', true, false, true),
    createData('Property 3', false, true, false),
  ];