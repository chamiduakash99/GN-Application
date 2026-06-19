package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.ItemDao;
import lk.earth.earthuniversity.entity.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/items")
public class ItemController {

    @Autowired
    private ItemDao itemDao;

    // 1) View All and View Selected
    @GetMapping(produces = "application/json")
    public List<Item> get(@RequestParam HashMap<String, String> param) {

        List<Item> items = itemDao.findAll();

        if (param.isEmpty()) return items;

        String itemName = param.get("itemname");
        String brandName = param.get("brandname");

        Stream<Item> itemStream = items.stream();

        if (itemName != null){
            itemStream = itemStream.filter(item -> item.getName().equalsIgnoreCase(itemName));
        }
        if (brandName != null){
            itemStream = itemStream.filter(item -> item.getBrand().getName().equalsIgnoreCase(brandName));
        }
        return itemStream.collect(Collectors.toList());
    }

    // 2) Save
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> save(@RequestBody Item item){

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Item extItemCode = itemDao.findByItemCode(item.getCode());
        Item extItemName = itemDao.findByItemName(item.getName());

        if (extItemCode != null){ errors = errors + "Existing Item Code <br>"; }
        if (extItemName != null){ errors = errors + "Existing Item Name <br>"; }

        if (errors == ""){ itemDao.save(item); }
        else { errors = "Server Validation Errors : <br> " +  errors ;}

        response.put("ItemCode" , item.getCode());
        response.put("url" , "/items/post");
        response.put("errors" , errors);

        return response;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Item item){
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Item extItemCode = itemDao.findByItemCode(item.getCode());
        Item extItemName = itemDao.findByItemName(item.getName());

        if (extItemCode != null && (!Objects.equals(item.getId(), extItemCode.getId()))){
            errors = errors + "Existing Item Code <br>";
        }
        if (extItemName != null && (!Objects.equals(item.getId(), extItemName.getId()))){
            errors = errors + "Existing Item Name <br>";
        }

        if (errors == ""){ itemDao.save(item); }
        else { errors = "Server Validation Errors : <br> " +  errors ;}

        response.put("ItemCode" , item.getCode());
        response.put("url" , "/items/put");
        response.put("errors" , errors);

        return response;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id){
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (itemDao.existsById(id)) {
            itemDao.delete(itemDao.findByMyId(id));
        }else {
            errors = "Server Validation Errors : <br> No Existing Item";
        }
        response.put("url" , "/items/put");
        response.put("errors" , errors);

        return response;
    }
}
