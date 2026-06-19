package lk.earth.earthuniversity.controller;


import lk.earth.earthuniversity.dao.ItemstatusDao;
import lk.earth.earthuniversity.dao.UsestatusDao;
import lk.earth.earthuniversity.entity.Itemstatus;
import lk.earth.earthuniversity.entity.Usestatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/itemstatuses")
public class ItemstatusController {

    @Autowired
    private ItemstatusDao itemstatusDao;

    @GetMapping(path = "/list", produces = "application/json")
    public List<Itemstatus> get() {

        List<Itemstatus> itemstatuses = this.itemstatusDao.findAll();

        itemstatuses = itemstatuses.stream().map(
                itemstatus -> { Itemstatus d = new Itemstatus();
                    d.setId(itemstatus.getId());
                    d.setName(itemstatus.getName());
                    return d; }
        ).collect(Collectors.toList());

        return itemstatuses;

    }

}


