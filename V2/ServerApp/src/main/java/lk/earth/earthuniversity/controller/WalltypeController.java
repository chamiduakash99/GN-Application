package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.WalltypeDao;
import lk.earth.earthuniversity.entity.Walltype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/walltype")
public class WalltypeController {

    @Autowired
    private WalltypeDao walltypeDao;

    @GetMapping("/list")
    public List<Walltype> getAll() {
        return walltypeDao.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Walltype> getById(@PathVariable Integer id) {
        return walltypeDao.findById(id);
    }

}