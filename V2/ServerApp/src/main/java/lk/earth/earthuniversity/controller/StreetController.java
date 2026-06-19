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
            streetStream = streetStream.filter(street -> street.getCodename().equalsIgnoreCase(codename));
        }
        if (fullname != null){
            streetStream = streetStream.filter(street -> street.getFullname().contains(fullname));
        }
        if (streetstatus != null){
            streetStream = streetStream.filter(street -> street.getStreetstatus().getStatus().equals(streetstatus));
        }  if (streettype != null){
            streetStream = streetStream.filter(street -> street.getStreettype().getName().equals(streettype));
        }  if (streetmatierial != null){
            streetStream = streetStream.filter(street -> street.getStreetmatierial().getName().equals(streetmatierial));
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

        if (errors == ""){ streetDao.save(street); }
        else { errors = "Server Validation Errors : <br> " +  errors ;}

        response.put("ItemCode" , street.getCodename());
        response.put("url" , "/items/post");
        response.put("errors" , errors);

        return response;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Street street){
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Street   extStreet = streetDao.findByCodename(street.getCodename());


        if (extStreet == null){ errors = errors + "There is no any record which has a codename as  " + street.getCodename();}

        if (extStreet != null && (!Objects.equals(street.getId(), extStreet.getId()))){
            errors = errors + "Existing Street Code Name <br>";
        }

        if (errors == ""){ streetDao.save(street); }
        else { errors = "Server Validation Errors : <br> " +  errors ;}

        response.put("ItemCode" , street.getCodename());
        response.put("url" , "/items/put");
        response.put("errors" , errors);

        return response;
    }
//
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
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
