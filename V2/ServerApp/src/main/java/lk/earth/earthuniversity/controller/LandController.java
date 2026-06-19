package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.LandDao;
import lk.earth.earthuniversity.entity.Land;
import lk.earth.earthuniversity.entity.Landfeaturedetails;
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
@RequestMapping(value = "/lands")
public class LandController {

    @Autowired
    private LandDao landDao;

    // 1️⃣ Get all lands (simple list)
    @GetMapping(path = "/list", produces = "application/json")
    public List<Land> getList() {
        return landDao.findAll();
    }

    // 2️⃣ Get all lands with filters
    @GetMapping(produces = "application/json")
    public List<Land> get(@RequestParam HashMap<String, String> param) {
        List<Land> lands = landDao.findAll();

        if (param.isEmpty()) return lands;

        String street = param.get("street");
            String landtype = param.get("landtype");
        String citizen = param.get("citizen");
        String fencetype = param.get("fencetype");

        String remarks = param.get("remarks");

        Stream<Land> landStream = lands.stream();

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
        if (remarks != null) {
            landStream = landStream.filter(l -> l.getRemarks() != null && l.getRemarks().contains(remarks));
        }

        return landStream.collect(Collectors.toList());
    }

    // 3️⃣ Save new Land
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> save(@RequestBody Land land) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        // Prevent duplicate based on Street + Citizen (same person owning land on same street)
        Land existing = landDao.findByStreetAndCitizen(
                land.getStreet(),
                land.getCitizen()
        );

        if (existing != null) {
            errors += "Existing land record found for this citizen on this street.<br>";
        }

        if (errors.isEmpty()) {
            for (Landfeaturedetails landfeaturedetails : land.getLandfeaturedetails()){
                landfeaturedetails.setLand(land);
            }
            landDao.save(land);
        } else {
            errors = "Server Validation Errors:<br>" + errors;
        }

        response.put("ItemCode", String.valueOf(land.getId()));
        response.put("url", "/lands/post");
        response.put("errors", errors);

        return response;
    }

    // 4️⃣ Update existing Land
    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Land land) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Optional<Land> existingLand = landDao.findById(land.getId());
        if (existingLand.isEmpty()) {
            errors = "No existing record found for ID: " + land.getId() + "<br>";
        }

        // Check duplicate condition again
        Land duplicate = landDao.findByStreetAndCitizen(
                land.getStreet(),
                land.getCitizen()
        );

        if (duplicate != null && !Objects.equals(land.getId(), duplicate.getId())) {
            errors += "Duplicate record found for this citizen on the same street.<br>";
        }

        if (errors.isEmpty()) {
            existingLand.get().getLandfeaturedetails().clear();
            land.getLandfeaturedetails().forEach(newlandfeaturedetails -> {
                newlandfeaturedetails.setLand(land);
                existingLand.get().getLandfeaturedetails().add(newlandfeaturedetails);
                newlandfeaturedetails.setLand(land);
            });
            BeanUtils.copyProperties(land, existingLand.get(), "id","landfeaturedetails");
            landDao.save(existingLand.get());
        } else {
            errors = "Server Validation Errors:<br>" + errors;
        }

        response.put("ItemCode", String.valueOf(land.getId()));
        response.put("url", "/lands/put");
        response.put("errors", errors);

        return response;
    }

    // 5️⃣ Delete Land
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (landDao.existsById(id)) {
            landDao.delete(landDao.findById(id).get());
        } else {
            errors = "Server Validation Errors:<br>No existing Land found.";
        }

        response.put("url", "/lands/delete");
        response.put("errors", errors);

        return response;
    }
}
