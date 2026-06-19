package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.EducationlevelDao;
import lk.earth.earthuniversity.entity.Educationlevel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/educationlevel")
public class EducationlevelController {

    @Autowired
    private EducationlevelDao educationlevelDao;

    @GetMapping("/list")
    public List<Educationlevel> getAll() {
        return educationlevelDao.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Educationlevel> getById(@PathVariable Integer id) {
        return educationlevelDao.findById(id);
    }
}