//
$(function () {
    var buyOrderId = getQueryValue("buyOrderId");
    
    var objOrder = {
        tableId: "tableList",
        init: function (callback) {
            var self = this;
            self.initData();
            self.render();
            
            self.finance();

            if(callback){
                callback.call(new Object());
            }
        },
        // 初始化数据
        initData: function () {
            var self = this;
            //更新数据
            $.getdata('/clientApi/UserBuyOrder/GetBuyOrderDetail?buyOrderId='+buyOrderId, {}, function(res){
                objBuyDetail.setBuyDetailValue(res);
            });
        },
        // 显示表格
        render: function () {
            var self = this;
            $.tableObject({
                tableId: self.tableId,
                tableOption: {
                    url: "/clientApi/UserBuyOrder/GetBuyOrderDetailProduct?buyOrderId="+buyOrderId,
                    page: false,
                    width: $(window).width()-22,
                    height: "full-" + self.searchBarHeight,
                    where: self.searchKeys,
                    cols: [
                        [listField.numbers,
                        listField.category,
                        listField.productSku,
                        listField.productName,
                        listField.specification,
                        listField.productRemark,
                        listField.productWeight,
                        listField.orderQty,
                        listField.inTransitQty,
                        listField.saleQty,
                        listField.holdQty,
                        listField.priceA,
                        listField.priceB,
                        listField.priceC,
                        listField.priceAvg,
                        listField.imageQty,
                        listField.areaPosition,
                        listField.qty,
                        listField.inqty,
                        listField.priceFixed,
                        listField.remarkFixed,
                    ]
                    ],
                    doneOk: function(a){
                        //显示数量
                        $.showQty(buyOrderId);
                    }
                }
            });
        },
        finance: function(){
            var self = this;
            $.getdata('/clientApi/UserBuyOrder/GetBuyPayRrcord?buyOrderId=' + buyOrderId, {}, function (res) {
                objBuyDetail.payList(res);
            });
        },
    };

    //
    var objOpt = {
        init: function(){
            var self = this;
            self.postOrder();
        },
        postOrder: function(){
            var self = this;
            $('#btnPostOrder').unbind('click').on('click', function(){
                win.confirm('确定提交开始采购吗？', function(){
                    $.postdata('/clientApi/UserBuyOrder/PostCheckedOrder', { BuyOrderId: buyOrderId}, function(res){
                        if(res){
                            win.msg('提交成功');
                            tabNum();
                        } else {
                            win.alert('提交失败');
                        }
                    });
                });
            });
        },
    }
    
    $('#orderBody').load('../static/templates/buyOrder.html', function(){
        objOrder.init(function(){
            objOpt.init();
        });
    });
});
