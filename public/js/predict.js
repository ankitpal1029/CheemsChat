async function predict (image){
    var result;
    let model = new cvstfjs.ClassificationModel();
    await model.loadModelAsync('../tfjsmodel/model.json');
    if(model){

        result = await model.executeAsync(image);
    }
    //console.log(result);
    return result;
}

export {predict};
