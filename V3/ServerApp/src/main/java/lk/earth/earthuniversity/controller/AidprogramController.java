package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.AidprogramDao;
import lk.earth.earthuniversity.entity.Aidprogram;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/aidprogram")
public class AidprogramController {

    @Autowired
    private AidprogramDao aidprogramDao;

    @GetMapping("/list")
    public List<Aidprogram> getAll() {
        return aidprogramDao.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Aidprogram> getById(@PathVariable Integer id) {
        return aidprogramDao.findById(id);
    }
}