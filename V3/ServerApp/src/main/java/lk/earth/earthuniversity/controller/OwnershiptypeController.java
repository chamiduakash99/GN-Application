package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.OwnershiptypeDao;
import lk.earth.earthuniversity.entity.Ownershiptype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/ownershiptype")
public class OwnershiptypeController {

    @Autowired
    private OwnershiptypeDao ownershiptypeDao;

    @GetMapping("/list")
    public List<Ownershiptype> getAll() {
        return ownershiptypeDao.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Ownershiptype> getById(@PathVariable Integer id) {
        return ownershiptypeDao.findById(id);
    }

}