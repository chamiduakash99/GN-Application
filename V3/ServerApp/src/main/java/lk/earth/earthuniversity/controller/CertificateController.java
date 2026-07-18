package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.CertificateDao;
import lk.earth.earthuniversity.dao.CertificaterequestDao;
import lk.earth.earthuniversity.entity.Certificate;
import lk.earth.earthuniversity.entity.Certificaterequest;
import lk.earth.earthuniversity.entity.Requeststatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping("/certificates")
public class CertificateController {

    @Autowired
    private CertificateDao certificatedao;

    @Autowired
    private CertificaterequestDao certificaterequestdao;

    // ──────────────────────────────────────────────────────────────
    // GET  /certificates[?cetificateno=X&requestId=Y]
    // ──────────────────────────────────────────────────────────────
    @GetMapping(produces = "application/json")
    public List<Certificate> get(@RequestParam HashMap<String, String> params) {

        List<Certificate> certificates = certificatedao.findAll();
        if (params.isEmpty()) return certificates;

        Stream<Certificate> stream = certificates.stream();

        String cetificateno = params.get("cetificateno");
        if (cetificateno != null)
            stream = stream.filter(c -> c.getCetificateno() != null &&
                    c.getCetificateno().contains(cetificateno));

        // Filter by the linked certificate request id
        String requestId = params.get("requestId");
        if (requestId != null) {
            int rid = Integer.parseInt(requestId);
            stream = stream.filter(c -> c.getCertificaterequest() != null &&
                    c.getCertificaterequest().getId() == rid);
        }

        return stream.collect(Collectors.toList());
    }

    // ──────────────────────────────────────────────────────────────
    // POST  /certificates
    // ──────────────────────────────────────────────────────────────
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Certificate certificate) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (certificate.getCetificateno() == null || certificate.getCetificateno().isEmpty()) {
            errors += "Certificate Number is required<br>";
        } else if (certificatedao.findByCetificateno(certificate.getCetificateno()) != null) {
            errors += "Certificate Number already exists<br>";
        }

        if (certificate.getCertificaterequest() == null) {
            errors += "Certificate Request is required<br>";
        }

        if (errors.isEmpty()) {
            certificate.setIssueddate(new Date(System.currentTimeMillis()));
            certificatedao.save(certificate);
        } else {
            errors = "Server Validation Errors : <br>" + errors;
        }

        response.put("id", String.valueOf(certificate.getId()));
        response.put("url", "/certificates/" + certificate.getId());
        response.put("errors", errors);
        return response;
    }

    // ──────────────────────────────────────────────────────────────
    // PUT  /certificates/{id}
    // ──────────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@PathVariable Integer id,
                                          @RequestBody Certificate certificate) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Certificate existing = certificatedao.findByMyId(id);
        if (existing == null) {
            errors = "Certificate Does Not Exist";
        }

        if (errors.isEmpty()) {
            certificate.setId(id);
            certificatedao.save(certificate);
        } else {
            errors = "Server Validation Errors : <br>" + errors;
        }

        response.put("id", String.valueOf(id));
        response.put("url", "/certificates/" + id);
        response.put("errors", errors);
        return response;
    }

    // ──────────────────────────────────────────────────────────────
    // PUT  /certificates/{id}/upload
    // Saves the scanned copy (PDF bytes) and changes request status
    // to Certificate Ready (id = 4).
    // Body: raw byte array (application/octet-stream)
    // ──────────────────────────────────────────────────────────────
    @PutMapping(value = "/{id}/upload", consumes = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> uploadScan(@PathVariable Integer id,
                                              @RequestBody byte[] scannedcopy) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Certificate certificate = certificatedao.findByMyId(id);
        if (certificate == null) {
            errors = "Certificate Does Not Exist";
        }

        if (errors.isEmpty()) {
            certificate.setScannedcopy(scannedcopy);
            certificatedao.save(certificate);

            // Change request status → Certificate Ready (id = 4)
            if (certificate.getCertificaterequest() != null) {
                Certificaterequest request = certificaterequestdao
                        .findByMyId(certificate.getCertificaterequest().getId());
                if (request != null) {
                    Requeststatus certReady = new Requeststatus();
                    certReady.setId(4); // Certificate Ready
                    request.setRequeststatus(certReady);
                    request.setUpdateddate(new Date(System.currentTimeMillis()));
                    certificaterequestdao.save(request);
                }
            }
        } else {
            errors = "Server Validation Errors : <br>" + errors;
        }

        response.put("id", String.valueOf(id));
        response.put("url", "/certificates/" + id);
        response.put("errors", errors);
        return response;
    }

    // ──────────────────────────────────────────────────────────────
    // PUT  /certificates/{id}/pickup
    // Marks that the physical hard copy has been picked up.
    // (Does NOT change the request status — that is handled by the
    //  download flow which sets status → Completed.)
    // ──────────────────────────────────────────────────────────────
    @PutMapping("/{id}/pickup")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> markPickedUp(@PathVariable Integer id) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Certificate certificate = certificatedao.findByMyId(id);
        if (certificate == null) {
            errors = "Certificate Does Not Exist";
        }

        if (errors.isEmpty()) {
            certificate.setHardcopypicked((byte) 1);
            certificate.setPickeddate(new Date(System.currentTimeMillis()));
            certificatedao.save(certificate);
        } else {
            errors = "Server Validation Errors : <br>" + errors;
        }

        response.put("id", String.valueOf(id));
        response.put("url", "/certificates/" + id);
        response.put("errors", errors);
        return response;
    }

    // ──────────────────────────────────────────────────────────────
    // GET  /certificates/{id}/scannedcopy
    // Returns the raw PDF bytes so the citizen can download the file.
    // The caller (citizen portal) is responsible for calling
    // PUT /certificaterequests/{requestId}/complete afterwards.
    // ──────────────────────────────────────────────────────────────
    @GetMapping("/{id}/scannedcopy")
    public ResponseEntity<byte[]> getScannedCopy(@PathVariable Integer id) {

        Certificate certificate = certificatedao.findByMyId(id);
        if (certificate == null || certificate.getScannedcopy() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"certificate_" + id + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(certificate.getScannedcopy());
    }

    // ──────────────────────────────────────────────────────────────
    // DELETE  /certificates/{id}
    // ──────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Certificate existing = certificatedao.findByMyId(id);
        if (existing == null) {
            errors = "Certificate Does Not Exist";
        }

        if (errors.isEmpty()) {
            certificatedao.deleteById(id);
        } else {
            errors = "Server Validation Errors : <br>" + errors;
        }

        response.put("id", String.valueOf(id));
        response.put("url", "/certificates/" + id);
        response.put("errors", errors);
        return response;
    }
}

//package lk.earth.earthuniversity.controller;
//
//import lk.earth.earthuniversity.dao.CertificateDao;
//import lk.earth.earthuniversity.entity.Certificate;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.List;
//import java.util.stream.Collectors;
//import java.util.stream.Stream;
//
//@CrossOrigin
//@RestController
//@RequestMapping(value = "/certificates")
//public class CertificateController {
//
//    @Autowired
//    private CertificateDao certificatedao;
//
//
//    @GetMapping(produces = "application/json")
//    public List<Certificate> get(@RequestParam HashMap<String,String> params){
//
//        List<Certificate> certificates = certificatedao.findAll();
//
//        if(params.isEmpty()) return certificates;
//
//        String cetificateno = params.get("cetificateno");
//
//        Stream<Certificate> cstream = certificates.stream();
//
//        if(cetificateno != null)
//            cstream = cstream.filter(c ->
//                    c.getCetificateno().contains(cetificateno));
//
//        return cstream.collect(Collectors.toList());
//
//    }
//
//
//    @GetMapping(path = "/list", produces = "application/json")
//    public List<Certificate> getList(){
//
//        List<Certificate> certificates = certificatedao.findAllNameId();
//
//        certificates = certificates.stream().map(
//                certificate -> {
//                    Certificate c = new Certificate(
//                            certificate.getId(),
//                            certificate.getCetificateno()
//                    );
//                    return c;
//                }
//        ).collect(Collectors.toList());
//
//        return certificates;
//
//    }
//
//
//    @PostMapping
//    @ResponseStatus(HttpStatus.CREATED)
//    public HashMap<String,String> add(@RequestBody Certificate certificate){
//
//        HashMap<String,String> response = new HashMap<>();
//
//        String errors = "";
//
//        if(certificatedao.findByCetificateno(
//                certificate.getCetificateno()) != null)
//
//            errors = errors + "<br> Existing Certificate Number";
//
//
//        if(errors.equals(""))
//            certificatedao.save(certificate);
//        else
//            errors = "Server Validation Errors : <br> " + errors;
//
//
//        response.put("id", String.valueOf(certificate.getId()));
//        response.put("url", "/certificates/" + certificate.getId());
//        response.put("errors", errors);
//
//        return response;
//
//    }
//
//
//    @PutMapping
//    @ResponseStatus(HttpStatus.CREATED)
//    public HashMap<String,String> update(@RequestBody Certificate certificate){
//
//        HashMap<String,String> response = new HashMap<>();
//
//        String errors = "";
//
//        Certificate c1 = certificatedao.findByCetificateno(
//                certificate.getCetificateno());
//
//        if(c1 != null && certificate.getId() != c1.getId())
//            errors = errors + "<br> Existing Certificate Number";
//
//
//        if(errors.equals(""))
//            certificatedao.save(certificate);
//        else
//            errors = "Server Validation Errors : <br> " + errors;
//
//
//        response.put("id", String.valueOf(certificate.getId()));
//        response.put("url", "/certificates/" + certificate.getId());
//        response.put("errors", errors);
//
//        return response;
//
//    }
//
//
//    @DeleteMapping("/{id}")
//    @ResponseStatus(HttpStatus.CREATED)
//    public HashMap<String,String> delete(@PathVariable Integer id){
//
//        HashMap<String,String> response = new HashMap<>();
//
//        String errors = "";
//
//        Certificate certificate = certificatedao.findByMyId(id);
//
//        if(certificate == null)
//            errors = errors + "<br> Certificate Does Not Exist";
//
//
//        if(errors.equals(""))
//            certificatedao.delete(certificate);
//        else
//            errors = "Server Validation Errors : <br> " + errors;
//
//
//        response.put("id", String.valueOf(id));
//        response.put("url", "/certificates/" + id);
//        response.put("errors", errors);
//
//        return response;
//
//    }
//
//}