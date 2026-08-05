package lk.earth.earthuniversity.report;

import lk.earth.earthuniversity.dao.*;
import lk.earth.earthuniversity.entity.*;
import lk.earth.earthuniversity.report.dao.*;
import lk.earth.earthuniversity.report.entity.CountByStreetMaterial;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Map;
import java.util.TreeMap;
import java.time.LocalDate;

import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;

@CrossOrigin
@RestController
@RequestMapping(value = "/reports")
public class ReportController {

   //Street

    @Autowired
    private CountByStreetMaterialDao countByStreetMaterialDao;

    @GetMapping(path = "/countbystreetmaterial", produces = "application/json")
    public List<CountReport> countByStreetMaterial() {
        return withPercentages(countByStreetMaterialDao.countByStreetMaterial());
    }

    //Land

    @Autowired
    private LandReportDao landReportDao;

    @GetMapping(path = "/landreport", produces = "application/json")
    public List<CountReport> countByLandTypes() {
        return withPercentages(landReportDao.countByLandType());
    }

    @Autowired
    private FenceReportDao fenceReportDao;

    @GetMapping(path = "/fencereport", produces = "application/json")
    public List<CountReport> countByFenceTypes() {
        return withPercentages(fenceReportDao.countByFenceType());
    }

    @Autowired
    private LandFeatureReportDao landFeatureReportDao;

    @GetMapping(path = "/landfeaturereport", produces = "application/json")
    public List<CountReport> countByLandFeatures() {
        return withPercentages(landFeatureReportDao.countByLandFeature());
    }

   //Building

    @Autowired
    private UsageReportDao usageReportDao;

    @GetMapping(path = "/usagereport", produces = "application/json")
    public List<CountReport> countByUsage() {
        return withPercentages(usageReportDao.countByUsage());
    }

    @Autowired
    private OwnershiptypeReportDao ownershiptypeReportDao;

    @GetMapping(path = "/ownershiptypereport", produces = "application/json")
    public List<CountReport> countByOwnershiptype() {
        return withPercentages(ownershiptypeReportDao.countByOwnershiptype());
    }

    @Autowired
    private BuildingtypeReportDao buildingtypeReportDao;

    @GetMapping(path = "/buildingtypereport", produces = "application/json")
    public List<CountReport> countByBuildingtype() {
        return withPercentages(buildingtypeReportDao.countByBuildingtype());
    }

    @Autowired
    private WalltypeReportDao walltypeReportDao;

    @GetMapping(path = "/walltypereport", produces = "application/json")
    public List<CountReport> countByWalltype() {
        return withPercentages(walltypeReportDao.countByWalltype());
    }

    @Autowired
    private FloortypeReportDao floortypeReportDao;

    @GetMapping(path = "/floortypereport", produces = "application/json")
    public List<CountReport> countByFloortype() {
        return withPercentages(floortypeReportDao.countByFloortype());
    }

    @Autowired
    private RooftypeReportDao rooftypeReportDao;

    @GetMapping(path = "/rooftypereport", produces = "application/json")
    public List<CountReport> countByRooftype() {
        return withPercentages(rooftypeReportDao.countByRooftype());
    }

    @Autowired
    private ReligionReportDao religionReportDao;


    //citizen
    @GetMapping(path = "/religionreport", produces = "application/json")
    public List<CountReport> countByReligion() {
        return withPercentages(religionReportDao.countByReligion());
    }

    @Autowired
    private MatiralstatusReportDao matiralstatusReportDao;

    @GetMapping(path = "/matiralstatusreport", produces = "application/json")
    public List<CountReport> countByMatiralstatus() {
        return withPercentages(matiralstatusReportDao.countByMatiralstatus());
    }

    @Autowired
    private EducationlevelReportDao educationlevelReportDao;

    @GetMapping(path = "/educationlevelreport", produces = "application/json")
    public List<CountReport> countByEducationlevel() {
        return withPercentages(educationlevelReportDao.countByEducationlevel());
    }

    @Autowired
    private EthnicityReportDao ethnicityReportDao;

    @GetMapping(path = "/ethnicityreport", produces = "application/json")
    public List<CountReport> countByEthnicity() {
        return withPercentages(ethnicityReportDao.countByEthnicity());
    }

    @Autowired
    private GenderReportDao genderReportDao;

    @GetMapping(path = "/genderreport", produces = "application/json")
    public List<CountReport> countByGender() {
        return withPercentages(genderReportDao.countByGender());
    }

    @Autowired
    private CitizenstatusReportDao citizenstatusReportDao;

    @GetMapping(path = "/citizenstatusreport", produces = "application/json")
    public List<CountReport> countByCitizenstatus() {
        return withPercentages(citizenstatusReportDao.countByCitizenstatus());
    }

    @Autowired
    private AidprogramReportDao aidprogramReportDao;

    @GetMapping(path = "/aidprogramreport", produces = "application/json")
    public List<CountReport> countByAidprogram() {
        return withPercentages(aidprogramReportDao.countByAidprogram());
    }

    @Autowired
    private HouseholdReportDao householdReportDao;

//   Household
    @GetMapping(path = "/householdreport", produces = "application/json")
    public List<CountReport> countHouseholdsByMemberCount(
            @RequestParam(value = "min", required = false) Integer min,
            @RequestParam(value = "max", required = false) Integer max) {

        List<Object[]> rows = householdReportDao.getHouseholdMemberCounts();

        Map<Integer, Long> buckets = new TreeMap<>();
        for (Object[] row : rows) {
            Number memberCount = (Number) row[1];
            int count = memberCount.intValue();

            if (min != null && count < min) continue;
            if (max != null && count > max) continue;

            buckets.merge(count, 1L, Long::sum);
        }

        List<CountReport> result = new ArrayList<>();
        for (Map.Entry<Integer, Long> entry : buckets.entrySet()) {
            CountReport cr = new CountReport();
            cr.setName(entry.getKey() + (entry.getKey() == 1 ? " member" : " members"));
            cr.setCount(entry.getValue());
            result.add(cr);
        }

        return withPercentages(result);
    }

    private List<CountReport> withPercentages(List<CountReport> list) {
        long totalCount = 0;
        for (CountReport record : list) {
            totalCount += record.getCount();
        }
        for (CountReport record : list) {
            double percentage = (double) record.getCount() / totalCount * 100;
            record.setPercentage(Math.round(percentage * 100.0) / 100.0);
        }
        return list;
    }

    //Voter registry

    @Autowired
    private VoterRegistryReportDao voterRegistryReportDao;

    @GetMapping(path = "/voterregistryreport", produces = "application/json")
    public List<CountReport> countVotersByAge(
            @RequestParam(value = "min", required = false) Integer min,
            @RequestParam(value = "max", required = false) Integer max) {

        List<Object[]> rows = voterRegistryReportDao.getVoterAges();

        Map<Integer, Long> buckets = new TreeMap<>();
        for (Object[] row : rows) {
            Number ageNum = (Number) row[1];
            int age = ageNum.intValue();

            if (min != null && age < min) continue;
            if (max != null && age > max) continue;

            buckets.merge(age, 1L, Long::sum);
        }

        List<CountReport> result = new ArrayList<>();
        for (Map.Entry<Integer, Long> entry : buckets.entrySet()) {
            CountReport cr = new CountReport();
            cr.setName(entry.getKey() + " years");
            cr.setCount(entry.getValue());
            result.add(cr);
        }

        return withPercentages(result);
    }

    //Announcement

    @Autowired
    private AnnouncementReportDao announcementReportDao;

    @GetMapping(path = "/announcementreport", produces = "application/json")
    public List<CountReport> countAnnouncements(
            @RequestParam(value = "start", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(value = "end", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        List<CountReport> list;
        if (start != null && end != null) {
            list = announcementReportDao.countByActiveStatusBetweenDates(
                    Timestamp.valueOf(start), Timestamp.valueOf(end));
        } else {
            list = announcementReportDao.countByActiveStatus();
        }
        return withPercentages(list);
    }

    //complaint

    @Autowired
    private ComplaintReportDao complaintReportDao;

    @Autowired
    private ComplaintstatusDao complaintstatusDao;

    @GetMapping(path = "/complaintreport", produces = "application/json")
    public List<CountReport> countComplaints(
            @RequestParam(value = "start", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(value = "end", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(value = "statusId", required = false) Integer statusId) {

        Timestamp startTs = (start != null) ? Timestamp.valueOf(start) : null;
        Timestamp endTs = (end != null) ? Timestamp.valueOf(end) : null;

        List<CountReport> list = complaintReportDao.countByStatus(startTs, endTs, statusId);
        return withPercentages(list);
    }

    @GetMapping(path = "/complaintstatuses", produces = "application/json")
    public List<Complaintstatus> getAllComplaintStatuses() {
        return complaintstatusDao.findAll();
    }

    //ID Card Request

    @Autowired
    private IdcardrequestReportDao idcardrequestReportDao;

    @Autowired
    private IdcardrequeststatusDao idcardrequeststatusDao;

    @GetMapping(path = "/idcardrequestreport", produces = "application/json")
    public List<CountReport> countIdcardRequests(
            @RequestParam(value = "start", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(value = "end", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(value = "statusId", required = false) Integer statusId) {

        Timestamp startTs = (start != null) ? Timestamp.valueOf(start) : null;
        Timestamp endTs = (end != null) ? Timestamp.valueOf(end) : null;

        List<CountReport> list = idcardrequestReportDao.countByStatus(startTs, endTs, statusId);
        return withPercentages(list);
    }

    @GetMapping(path = "/idcardrequeststatuses", produces = "application/json")
    public List<Idcardrequeststatus> getAllIdcardRequestStatuses() {
        return idcardrequeststatusDao.findAll();
    }

    // cultivation

    @Autowired
    private CultivationReportDao cultivationReportDao;

    @Autowired
    private CroptypeDao croptypeDao;

    @Autowired
    private CultivationstatusDao cultivationstatusDao;

    @GetMapping(path = "/cultivationreport", produces = "application/json")
    public List<CountReport> countCultivations(
            @RequestParam(value = "statusId", required = false) Integer statusId,
            @RequestParam(value = "start", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate start,
            @RequestParam(value = "end", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate end,
            @RequestParam(value = "minArea", required = false) BigDecimal minArea,
            @RequestParam(value = "maxArea", required = false) BigDecimal maxArea) {

        Date startDate = (start != null) ? Date.valueOf(start) : null;
        Date endDate = (end != null) ? Date.valueOf(end) : null;

        List<CountReport> list = cultivationReportDao.countByCropType(statusId, startDate, endDate, minArea, maxArea);
        return withPercentages(list);
    }

    @GetMapping(path = "/cultivationstatuses", produces = "application/json")
    public List<Cultivationstatus> getAllCultivationStatuses() {
        return cultivationstatusDao.findAll();
    }

    //Harvest

    @Autowired
    private HarvestReportDao harvestReportDao;

    @GetMapping(path = "/harvestreport", produces = "application/json")
    public List<CountReport> countHarvests(
            @RequestParam(value = "start", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(value = "end", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam(value = "minQty", required = false) BigDecimal minQty,
            @RequestParam(value = "maxQty", required = false) BigDecimal maxQty) {

        Date startDate = (start != null) ? Date.valueOf(start) : null;
        Date endDate = (end != null) ? Date.valueOf(end) : null;

        List<Object[]> rows = harvestReportDao.getHarvestSummaryByMonth(startDate, endDate, minQty, maxQty);

        List<CountReport> result = new ArrayList<>();
        for (Object[] row : rows) {
            CountReport cr = new CountReport();
            cr.setName((String) row[0]);
            cr.setCount(((Number) row[2]).longValue());
            BigDecimal totalQty = (row[1] != null) ? BigDecimal.valueOf(((Number) row[1]).doubleValue()) : BigDecimal.ZERO;
            cr.setValue(totalQty);
            result.add(cr);
        }

        return withPercentages(result);
    }

    // certificate request

    @Autowired
    private CertificateReportDao certificateReportDao;

    @Autowired
    private RequeststatusDao requeststatusDao; // adjust import based on what you confirm exists

    @GetMapping(path = "/certificatereport", produces = "application/json")
    public List<CountReport> countCertificates(
            @RequestParam(value = "statusId", required = false) Integer statusId,
            @RequestParam(value = "picked", required = false) Byte picked,
            @RequestParam(value = "start", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(value = "end", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        Date startDate = (start != null) ? Date.valueOf(start) : null;
        Date endDate = (end != null) ? Date.valueOf(end) : null;

        List<CountReport> list = certificateReportDao.countByStatus(statusId, picked, startDate, endDate);
        return withPercentages(list);
    }

    @GetMapping(path = "/requeststatuses", produces = "application/json")
    public List<Requeststatus> getAllRequestStatuses() {
        return requeststatusDao.findAll();
    }

    //Citizen skill

    @Autowired
    private CitizenskillReportDao citizenskillReportDao;

    @Autowired
    private ProfessionDao professionDao;

    @GetMapping(path = "/citizenskillreport", produces = "application/json")
    public List<CountReport> countCitizenSkills(
            @RequestParam(value = "professionId", required = false) Integer professionId,
            @RequestParam(value = "minExp", required = false) Integer minExp,
            @RequestParam(value = "maxExp", required = false) Integer maxExp,
            @RequestParam(value = "minIncome", required = false) BigDecimal minIncome,
            @RequestParam(value = "maxIncome", required = false) BigDecimal maxIncome) {

        List<CountReport> list = citizenskillReportDao.countByProfession(
                professionId, minExp, maxExp, minIncome, maxIncome);
        return withPercentages(list);
    }

    @GetMapping(path = "/professions", produces = "application/json")
    public List<Profession> getAllProfessions() {
        return professionDao.findAll();
    }


}