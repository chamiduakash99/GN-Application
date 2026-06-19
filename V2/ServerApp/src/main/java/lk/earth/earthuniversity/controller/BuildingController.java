package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.BuildingDao;
import lk.earth.earthuniversity.entity.Building;
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
@RequestMapping(value = "/buildings")
public class BuildingController {

    @Autowired
    private BuildingDao buildingDao;

    // 1) View List (Simple)
    @GetMapping(path ="/list",produces = "application/json")
    public List<Building> get() {
        List<Building> list = buildingDao.findAll();


//        for (Building b : list) {
//            if (b.getLand() !=null)
//                System.out.println("Checking");
//            System.out.println(b.getLand().getId());
//        }
        return buildingDao.findAll();

    }

//     2) View All + Filter
    @GetMapping(produces = "application/json")
    public List<Building> get(@RequestParam HashMap<String, String> param) {

        List<Building> buildings = buildingDao.findAll();

        if (param.isEmpty()) return buildings;

        String no = param.get("no");
        String ownershiptype = param.get("ownershiptype");
        String usage = param.get("usage");
        String buildingtype = param.get("buildingtype");
        String walltype = param.get("walltype");
        String floortype = param.get("floortype");
        String rooftype = param.get("rooftype");

        Stream<Building> buildingStream = buildings.stream();


        if (no != null){
            buildingStream = buildingStream.filter(b -> b.getNo().equalsIgnoreCase(no));
        }
        if (ownershiptype != null){
            buildingStream = buildingStream.filter(b -> b.getOwnershiptype().getName().equals(ownershiptype));
        }
        if (usage != null){
            buildingStream = buildingStream.filter(b -> b.getUsage().getName().equals(usage));
        }
        if (buildingtype != null){
            buildingStream = buildingStream.filter(b -> b.getBuildingtype().getName().equals(buildingtype));
        }
        if (walltype != null){
            buildingStream = buildingStream.filter(b -> b.getWalltype().getName().equals(walltype));
        }
        if (floortype != null){
            buildingStream = buildingStream.filter(b -> b.getFloortype().getName().equals(floortype));
        }
        if (rooftype != null){
            buildingStream = buildingStream.filter(b -> b.getRooftype().getName().equals(rooftype));
        }

        return buildingStream.collect(Collectors.toList());
    }

    // 3) Save
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> save(@RequestBody Building building){

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Building extBuilding = buildingDao.findByNo(building.getNo());

        if (extBuilding != null){
            errors = errors + "Existing Building Number <br>";
        }

        if (errors.equals("")){
            buildingDao.save(building);
        } else {
            errors = "Server Validation Errors : <br> " +  errors ;
        }

        response.put("ItemCode" , building.getNo());
        response.put("url" , "/buildings/post");
        response.put("errors" , errors);

        return response;
    }

    // 4) Update
    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Building building){

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Building extBuilding = buildingDao.findByNo(building.getNo());

        if (extBuilding == null){
            errors = errors + "There is no record with Building Number " + building.getNo();
        }

        if (extBuilding != null && (!Objects.equals(building.getId(), extBuilding.getId()))){
            errors = errors + "Existing Building Number <br>";
        }

        if (errors.equals("")){
            buildingDao.save(building);
        } else {
            errors = "Server Validation Errors : <br> " +  errors ;
        }

        response.put("ItemCode" , building.getNo());
        response.put("url" , "/buildings/put");
        response.put("errors" , errors);

        return response;
    }

    // 5) Delete
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id){

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Optional<Building> building = buildingDao.findById(id);

        if (buildingDao.existsById(id)) {
            buildingDao.delete(building.get());
        } else {
            errors = "Server Validation Errors : <br> No Existing Item";
        }

        response.put("url" , "/buildings/delete");
        response.put("errors" , errors);

        return response;
    }
}