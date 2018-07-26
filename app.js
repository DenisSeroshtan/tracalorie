// storage controller

const StorageCtrl = (function(){})();

// item controller
const ItemCtrl = (function(){
  const Item = function(id, name, calories ) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  const data = {
    
    items : [
      {id: 0, name: "Мясо", calories: 1000},
      {id: 0, name: "Печенье", calories: 1300},
      {id: 0, name: "Яица", calories: 700}
    ],
    currentItem : null,
    totalCalories : 0
  }

  return {
    logData: function() {
      return data
    },
    getItems: function() {
      return data.items
    }
  }
})();

//UI contoller
const UICtrl = (function(){
  const UISelector = {
    itemList : "#item-list"
  }

  return {
    populateItemList : function(items) {
      let html = '';

        items.forEach(item => {
          html += `  
            <li class="collection-item" id="item-${item.id}">
              <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
              <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
              </a>
            </li>
          `
      });

      document.querySelector(UISelector.itemList).innerHTML = html;
    }
  }
})();

//App controller
const App = (function(ItemCtrl, UICtrl){

  return {
    init: function() {
      const items = ItemCtrl.getItems();

      UICtrl.populateItemList(items)
    }
  }
})(ItemCtrl, UICtrl);
// item controller 

// init app
App.init()


