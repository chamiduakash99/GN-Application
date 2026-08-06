package lk.earth.earthuniversity.controller;
import lk.earth.earthuniversity.dao.StreetDao;
import lk.earth.earthuniversity.entity.Street;
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
@RequestMapping(value = "/streets")
public class StreetController {

    @Autowired
    private StreetDao streetDao;

    @GetMapping(path ="/list",produces = "application/json")
    public List<Street> get() {

        return streetDao.findAll();

    }


    // 1) View All and View Selected
    @GetMapping(produces = "application/json")
    public List<Street> get(@RequestParam HashMap<String, String> param) {

        List<Street> streets = streetDao.findAll();

        if (param.isEmpty()) return streets;

        String codename = param.get("codename");
        String fullname = param.get("fullname");
        String streetstatus = param.get("streetstatus");
        String streettype = param.get("streettype");
        String streetmatierial = param.get("streetmatierial");




        Stream<Street> streetStream = streets.stream();

        if (codename != null){
            streetStream = streetStream.filter(street -> street.getCodename() != null && street.getCodename().toLowerCase().contains(codename.toLowerCase()));
        }
        if (fullname != null){
            streetStream = streetStream.filter(street -> street.getFullname() != null && street.getFullname().toLowerCase().contains(fullname.toLowerCase()));
        }
        if (streetstatus != null){
            streetStream = streetStream.filter(street -> street.getStreetstatus() != null && street.getStreetstatus().getStatus() != null && street.getStreetstatus().getStatus().equals(streetstatus));
        }  if (streettype != null){
            streetStream = streetStream.filter(street -> street.getStreettype() != null && street.getStreettype().getName() != null && street.getStreettype().getName().equals(streettype));
        }  if (streetmatierial != null){
            streetStream = streetStream.filter(street -> street.getStreetmatierial() != null && street.getStreetmatierial().getName() != null && street.getStreetmatierial().getName().equals(streetmatierial));
        }
        return streetStream.collect(Collectors.toList());
    }

    // 2) Save
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
        public HashMap<String, String> save(@RequestBody Street street){

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Street extStreetCodeName = streetDao.findByCodename(street.getCodename());
//        Street extItemName = streetDao.findByItemName(street.fullname());

        if (extStreetCodeName != null){ errors = errors + "Existing Street Code Name <br>"; }
//        if (extItemName != null){ errors = errors + "Existing Item Name <br>"; }

        if (errors.isEmpty()){ streetDao.save(street); }
        else { errors = "Server Validation Errors : <br> " +  errors ;}

        response.put("ItemCode" , street.getCodename());
        response.put("url" , "/items/post");
        response.put("errors" , errors);

        return response;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> update(@RequestBody Street street){
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        // Look the record up by id. The old code searched by the NEW codename, which
        // made renaming a street impossible - the new name never existed yet.
        if (streetDao.findById(street.getId()).isEmpty()){
            errors = errors + "Street Does Not Exist <br>";
        }

        if (street.getCodename() != null && !street.getCodename().trim().isEmpty()){
            Street extStreet = streetDao.findByCodename(street.getCodename().trim());
            if (extStreet != null && !Objects.equals(street.getId(), extStreet.getId())){
                errors = errors + "Existing Street Code Name <br>";
            }
        }

        if (errors.isEmpty()){ streetDao.save(street); }
        else { errors = "Server Validation Errors : <br> " +  errors ;}

        response.put("ItemCode" , street.getCodename());
        response.put("url" , "/items/put");
        response.put("errors" , errors);

        return response;
    }
//
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> delete(@PathVariable Integer id){
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Optional<Street> street = streetDao.findById(1);
        if (streetDao.existsById(id)) {
            streetDao.delete(streetDao.findById(id).get());
        }else {
            errors = "Server Validation Errors : <br> No Existing Item";
        }
        response.put("url" , "/street/put");
        response.put("errors" , errors);

        return response;
    }
}
