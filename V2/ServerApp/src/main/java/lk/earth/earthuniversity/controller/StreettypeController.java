package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.StreettypeDao;
import lk.earth.earthuniversity.entity.Streettype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/streettype")
public class StreettypeController {

    @Autowired
    private StreettypeDao streettypeDao;

    @GetMapping("/list")
    public List<Streettype> getAll() {
        return streettypeDao.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Streettype> getById(@PathVariable Integer id) {
        return streettypeDao.findById(id);
    }

}