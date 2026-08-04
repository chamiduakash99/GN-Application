package lk.earth.earthuniversity.controller;


import lk.earth.earthuniversity.dao.LanddetailDao;
import lk.earth.earthuniversity.entity.Landdetail;
import lk.earth.earthuniversity.entity.LandfeatureHasLanddetail;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/landdetails")
public class LanddetailController {

    @Autowired
    LanddetailDao landdetailDao;

    @GetMapping(path = "/list", produces = "application/json")
    public List<Landdetail> getList() {
        return landdetailDao.findAll();
    }

    @GetMapping(produces = "application/json")
    public List<Landdetail> get(@RequestParam HashMap<String, String> param) {
        List<Landdetail> landdetails = landdetailDao.findAll();

        if (param.isEmpty()) return landdetails;

        String street = param.get("street");
        String landtype = param.get("landtype");
        String citizen = param.get("citizen");
        String fencetype = param.get("fencetype");
        String landfeature = param.get("landfeature");

        String remarks = param.get("remarks");
        String deedno = param.get("deedno");

        Stream<Landdetail> landStream = landdetails.stream();

        if (street != null) {
            landStream = landStream.filter(l -> l.getStreet().getFullname().equalsIgnoreCase(street));
        }
        if (landtype != null) {
            landStream = landStream.filter(l -> l.getLandtype().getName().equalsIgnoreCase(landtype));
        }
        if (citizen != null) {
            landStream = landStream.filter(l -> l.getCitizen().getName().equalsIgnoreCase(citizen));
        }
        if (fencetype != null) {
            landStream = landStream.filter(l -> l.getFencetype().getName().equalsIgnoreCase(fencetype));
        }
        if (landfeature != null) {
            landStream = landStream.filter(l -> l.getLandfeaturedetails() != null &&
                    l.getLandfeaturedetails().stream().anyMatch(lfd ->
                            lfd.getLandfeature() != null &&
                                    lfd.getLandfeature().getName().equalsIgnoreCase(landfeature)));
        }
        if (remarks != null) {
            landStream = landStream.filter(l -> l.getRemarks() != null && l.getRemarks().contains(remarks));
        }
        if (deedno != null) {
            landStream = landStream.filter(l -> l.getDeedno() != null && l.getDeedno().equalsIgnoreCase(deedno));
        }

        return landStream.collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> save(@RequestBody Landdetail landdetail) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";


        if (landdetail.getDeedno() != null && !landdetail.getDeedno().isEmpty()) {
            Landdetail existingDeed = landdetailDao.findByDeedno(landdetail.getDeedno());

            if (existingDeed != null) {
                errors += "Deed number already exists.<br>";
            }
        }

        if (landdetail.getLandfeaturedetails() == null || landdetail.getLandfeaturedetails().isEmpty()) {
            errors += "At least one Land Feature is required.<br>";
        }

        if (errors.isEmpty()) {
            for (LandfeatureHasLanddetail landfeatureHasLanddetail : landdetail.getLandfeaturedetails()){
                landfeatureHasLanddetail.setLanddetail(landdetail);
            }
            landdetailDao.save(landdetail);
        } else {
            errors = "Server Validation Errors:<br>" + errors;
        }

        response.put("ItemCode", String.valueOf(landdetail.getId()));
        response.put("url", "/lands/post");
        response.put("errors", errors);

        return response;
    }
    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Landdetail landdetail) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Optional<Landdetail> existingLand = landdetailDao.findById(landdetail.getId());
        if (existingLand.isEmpty()) {
            errors = "No existing record found for ID: " + landdetail.getId() + "<br>";
        }


        if (landdetail.getDeedno() != null && !landdetail.getDeedno().isEmpty()) {

            Landdetail existingDeed = landdetailDao.findByDeedno(landdetail.getDeedno());

            if (existingDeed != null &&
                    !Objects.equals(existingDeed.getId(), landdetail.getId())) {

                errors += "Deed number already exists.<br>";
            }
        }

        if (landdetail.getLandfeaturedetails() == null || landdetail.getLandfeaturedetails().isEmpty()) {
            errors += "At least one Land Feature is required.<br>";
        }

        if (errors.isEmpty()) {
            existingLand.get().getLandfeaturedetails().clear();
            landdetail.getLandfeaturedetails().forEach(newlandfeaturedetails -> {
                newlandfeaturedetails.setLanddetail(landdetail);
                existingLand.get().getLandfeaturedetails().add(newlandfeaturedetails);
                newlandfeaturedetails.setLanddetail(landdetail);
            });
            BeanUtils.copyProperties(landdetail, existingLand.get(), "id","landfeaturedetails");
            landdetailDao.save(existingLand.get());
        } else {
            errors = "Server Validation Errors:<br>" + errors;
        }

        response.put("ItemCode", String.valueOf(landdetail.getId()));
        response.put("url", "/lands/put");
        response.put("errors", errors);

        return response;
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (landdetailDao.existsById(id)) {
            landdetailDao.delete(landdetailDao.findById(id).get());
        } else {
            errors = "Server Validation Errors:<br>No existing Land found.";
        }

        response.put("url", "/lands/delete");
        response.put("errors", errors);

        return response;
    }
}
