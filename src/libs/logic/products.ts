import { useFeeneyStore } from "../store/store";

export const getAllProducts = (): Promise<Array<any>> => {

    return fetch("https://feeney3d.com/api/products", {
        headers: { 'Content-Type': 'application/json' }
    }).then((res) => res.json())

}


export function getIntermediatePost(height?: number) {

    let railingType = "";
    let postMounting = "";
    let currentHeight = "";
    const getRailingType = useFeeneyStore.subscribe(
        (state) => [state.railingType, state.postMounting, state.railingHeight],
        (chunks) => {
            railingType = chunks[0];
            postMounting = chunks[1];
            currentHeight = chunks[2]
        },
        {
            fireImmediately: true,
        }
    )
    getRailingType()
    const heightValue = height ? height : currentHeight;
    getAllProducts().then((products)=>{
        for (let i = 0; i < products.length; i++) {
            if (
                products[i].railingType &&
                products[i].railingType.includes(railingType) &&
                products[i].productType === 'Intermediate Post' &&
                products[i].mountType === postMounting &&
                products[i].heightGroup === heightValue
            ) {
                console.log(products[i])
                return products[i];
            }
        }
        const error = `railing type': ${railingType},
      'mount type': ${postMounting},
      'height': ${heightValue}`;
    })


}