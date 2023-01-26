function __SRJ(obj){
    let __finalSRJ__ = "";
    if(JSON.stringify(obj[0]) == undefined){//判断是否最开始就是空的
        __finalSRJ__ = "I don't quite understand what you mean !";
    }else {
        let __del = RegExp('"',"g");
        let __everOne;
        let everOne = [];
        for(let i = 0;i < obj.length; i++){//将每一个JSON对象改成?=?&...
            __everOne = JSON.stringify(obj[i]).substring(1,JSON.stringify(obj[i]).length - 1).replace(__del,"").split(",");
            for(let j=0;j< __everOne.length;j++){
                everOne = __everOne[j].split(":");
                __finalSRJ__ += (everOne[0]+"="+everOne[1]+"&");
            }
        }
        __del = null;__everOne = null;everOne = null;//释放内存
        __finalSRJ__ = __finalSRJ__.substring(0,__finalSRJ__.length - 1);//清除最后一个的&
    }
    return __finalSRJ__;//标记释放
}

export {__SRJ}//导出