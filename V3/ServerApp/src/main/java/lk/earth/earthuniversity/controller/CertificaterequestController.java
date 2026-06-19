package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.CertificaterequestDao;
import lk.earth.earthuniversity.entity.Certificaterequest;

import lk.earth.earthuniversity.entity.Requeststatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping("/certificaterequests")
//@RequestMapping(value = "/certificaterequests")
public class CertificaterequestController {

    @Autowired
    private CertificaterequestDao certificaterequestdao;


    @GetMapping(produces = "application/json")
    public List<Certificaterequest> get(@RequestParam HashMap<String,String> params){

        List<Certificaterequest> requests =
                certificaterequestdao.findAll();

        if(params.isEmpty()) return requests;

        String purpose = params.get("purpose");
        String citizenid = params.get("citizenid");
        String requeststatusid = params.get("requeststatusid");
        String certificatetypeid = params.get("certificatetypeid");

        Stream<Certificaterequest> rstream = requests.stream();

        if(purpose != null)
            rstream = rstream.filter(r ->
                    r.getPurpose().contains(purpose));

        if(citizenid != null)
            rstream = rstream.filter(r ->
                    r.getCitizen().getId() ==
                            Integer.parseInt(citizenid));

        if(requeststatusid != null)
            rstream = rstream.filter(r ->
                    r.getRequeststatus().getId() ==
                            Integer.parseInt(requeststatusid));

        if(certificatetypeid != null)
            rstream = rstream.filter(r ->
                    r.getCertificatetype().getId() ==
                            Integer.parseInt(certificatetypeid));

        return rstream.collect(Collectors.toList());

    }


    @GetMapping(path = "/list", produces = "application/json")
    public List<Certificaterequest> getList(){

        List<Certificaterequest> requests =
                certificaterequestdao.findAllNameId();

        requests = requests.stream().map(
                request -> {
                    Certificaterequest cr =
                            new Certificaterequest(
                                    request.getId(),
                                    request.getPurpose()
                            );

                    return cr;
                }
        ).collect(Collectors.toList());

        return requests;

    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> add(
            @RequestBody Certificaterequest certificaterequest){

        HashMap<String,String> response = new HashMap<>();

        String errors = "";

        if(errors.equals("")) {
            // Auto set requested date
            certificaterequest.setRequesteddate(
                    new java.sql.Date(System.currentTimeMillis()));

            // Auto set updated date
            certificaterequest.setUpdateddate(
                    new java.sql.Date(System.currentTimeMillis()));

            // Auto set default status to Pending (id=1)
            Requeststatus pending = new Requeststatus();
            pending.setId(1);
            certificaterequest.setRequeststatus(pending);

            certificaterequestdao.save(certificaterequest);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }
        return response;
    }

//    @PostMapping
//    @ResponseStatus(HttpStatus.CREATED)
//    public HashMap<String,String> add(
//            @RequestBody Certificaterequest certificaterequest){
//
//        HashMap<String,String> response = new HashMap<>();
//
//        String errors = "";
//
//        if(errors.equals(""))
//            certificaterequestdao.save(certificaterequest);
//        else
//            errors = "Server Validation Errors : <br> " + errors;
//
//        response.put("id",
//                String.valueOf(certificaterequest.getId()));
//
//        response.put("url",
//                "/certificaterequests/" +
//                        certificaterequest.getId());
//
//        response.put("errors", errors);
//
//        return response;
//
//    }


    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> update(
            @RequestBody Certificaterequest certificaterequest){

        HashMap<String,String> response = new HashMap<>();

        String errors = "";

        if(errors.equals(""))
            certificaterequestdao.save(certificaterequest);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id",
                String.valueOf(certificaterequest.getId()));

        response.put("url",
                "/certificaterequests/" +
                        certificaterequest.getId());

        response.put("errors", errors);

        return response;

    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(
            @PathVariable Integer id){

        HashMap<String,String> response = new HashMap<>();

        String errors = "";

        Certificaterequest request =
                certificaterequestdao.findByMyId(id);

        if(request == null)
            errors = errors +
                    "<br> Certificate Request Does Not Exist";

        if(errors.equals(""))
            certificaterequestdao.delete(request);
        else
            errors = "Server Validation Errors : <br> " + errors;

        response.put("id", String.valueOf(id));

        response.put("url",
                "/certificaterequests/" + id);

        response.put("errors", errors);

        return response;

    }

    @GetMapping(value = "/status-summary", produces = "application/json")
    public List<HashMap<String, Object>> getStatusSummary() {

        List<Object[]> result = certificaterequestdao.getStatusSummary();

        List<HashMap<String, Object>> summary = new ArrayList<>();

        for (Object[] row : result) {
            HashMap<String, Object> map = new HashMap<>();
            map.put("status", row[0]);
            map.put("count", row[1]);
            summary.add(map);
        }

        return summary;
    }

}