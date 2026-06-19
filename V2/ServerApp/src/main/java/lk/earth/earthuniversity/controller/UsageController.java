package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.UsageDao;
import lk.earth.earthuniversity.entity.Usage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/usage")
public class UsageController {

    @Autowired
    private UsageDao usageDao;

    @GetMapping("/list")
    public List<Usage> getAll() {
        return usageDao.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Usage> getById(@PathVariable Integer id) {
        return usageDao.findById(id);
    }

}