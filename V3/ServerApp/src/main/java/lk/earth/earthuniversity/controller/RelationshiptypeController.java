package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.RelationshiptypeDao;
import lk.earth.earthuniversity.entity.Relationshiptype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/relationshiptype")
public class RelationshiptypeController {

    @Autowired
    private RelationshiptypeDao relationshiptypeDao;

    @GetMapping("/list")
    public List<Relationshiptype> getAll() {
        return relationshiptypeDao.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Relationshiptype> getById(@PathVariable Integer id) {
        return relationshiptypeDao.findById(id);
    }
}