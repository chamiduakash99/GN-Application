package lk.earth.earthuniversity.controller;
import lk.earth.earthuniversity.dao.IdcardrequestDao;
import lk.earth.earthuniversity.entity.Idcardrequest;
import lk.earth.earthuniversity.entity.Idcardrequeststatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@CrossOrigin
@RestController
@RequestMapping("/idcardrequests")
public class IdcardrequestController {


    @Autowired
    private IdcardrequestDao idcardrequestdao;

    @GetMapping(produces = "application/json")
    public List<Idcardrequest> get(
            @RequestParam HashMap<String,String> params){

        List<Idcardrequest> requests = idcardrequestdao.findAll();

        if(params.isEmpty())
            return requests;


        String citizenid = params.get("citizenid");

        String reasonid = params.get("reasonid");

        String statusid = params.get("idcardrequeststatusid");


        Stream<Idcardrequest> stream = requests.stream();


        if(citizenid != null)

            stream = stream.filter(
                    i -> i.getCitizen().getId() == Integer.parseInt(citizenid));

        if(reasonid != null)

            stream = stream.filter(i -> i.getReason().getId() == Integer.parseInt(reasonid));

        if(statusid != null)
            stream = stream.filter(i -> i.getIdcardrequeststatus().getId() == Integer.parseInt(statusid));
        return stream.collect(Collectors.toList());
    }
    @GetMapping(path="/list",
            produces="application/json")
    public List<Idcardrequest> getList(){
        return idcardrequestdao.findAllNameId();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> add(
            @RequestBody Idcardrequest idcardrequest){
        HashMap<String,String> response = new HashMap<>();
        String errors = "";

        if(errors.equals("")){
            idcardrequest.setApplieddate(new Timestamp(System.currentTimeMillis()));
            Idcardrequeststatus pending = new Idcardrequeststatus();
            pending.setId(1);
            idcardrequest.setIdcardrequeststatus(pending);
            idcardrequestdao.save(idcardrequest);
        }

        else {errors = "Server Validation Errors : <br>" + errors;}

        response.put("id", String.valueOf(idcardrequest.getId()));

        response.put("url", "/idcardrequests/" +idcardrequest.getId());

        response.put("errors", errors);
        return response;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> update(
            @RequestBody Idcardrequest idcardrequest){
        HashMap<String,String> response = new HashMap<>();
        String errors="";

        if(errors.equals(""))
            idcardrequestdao.save(idcardrequest);
        else
            errors = "Server Validation Errors : <br>" + errors;

        response.put("id", String.valueOf(idcardrequest.getId()));
        response.put("errors", errors);
        return response;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(
            @PathVariable Integer id){

        HashMap<String,String> response = new HashMap<>();

        String errors="";

        Idcardrequest request = idcardrequestdao.findByMyId(id);

        if(request == null)
            errors = "<br> ID Card Request Does Not Exist";

        if(errors.equals(""))
            idcardrequestdao.delete(request);
        else
            errors = "Server Validation Errors : <br>" +errors;
        response.put("id", String.valueOf(id));
        response.put("errors", errors);
        return response;
    }

    @GetMapping(value="/status-summary", produces="application/json")
    public List<HashMap<String,Object>> getStatusSummary(){

        List<Object[]> result = idcardrequestdao.getStatusSummary();

        List<HashMap<String,Object>> summary = new ArrayList<>();

        for(Object[] row: result){
            HashMap<String,Object> map = new HashMap<>();
            map.put("status", row[0]);
            map.put("count", row[1]);
            summary.add(map);
        }
        return summary;
    }
}