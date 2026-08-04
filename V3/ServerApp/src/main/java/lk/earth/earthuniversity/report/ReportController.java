package lk.earth.earthuniversity.report;

import lk.earth.earthuniversity.report.dao.CountByStreetMaterialDao;
import lk.earth.earthuniversity.report.dao.FenceReportDao;
import lk.earth.earthuniversity.report.dao.LandFeatureReportDao;
import lk.earth.earthuniversity.report.dao.LandReportDao;
import lk.earth.earthuniversity.report.entity.CountByStreetMaterial;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import lk.earth.earthuniversity.report.dao.UsageReportDao;
import lk.earth.earthuniversity.report.dao.OwnershiptypeReportDao;
import lk.earth.earthuniversity.report.dao.BuildingtypeReportDao;
import lk.earth.earthuniversity.report.dao.WalltypeReportDao;
import lk.earth.earthuniversity.report.dao.FloortypeReportDao;
import lk.earth.earthuniversity.report.dao.RooftypeReportDao;
import lk.earth.earthuniversity.report.dao.ReligionReportDao;
import lk.earth.earthuniversity.report.dao.MatiralstatusReportDao;
import lk.earth.earthuniversity.report.dao.EducationlevelReportDao;
import lk.earth.earthuniversity.report.dao.EthnicityReportDao;
import lk.earth.earthuniversity.report.dao.GenderReportDao;
import lk.earth.earthuniversity.report.dao.CitizenstatusReportDao;
import lk.earth.earthuniversity.report.dao.AidprogramReportDao;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/reports")
public class ReportController {

    @Autowired
    private CountByStreetMaterialDao countByStreetMaterialDao;

    @GetMapping(path = "/countbystreetmaterial", produces = "application/json")
    public List<CountReport> countByStreetMaterial() {
        return withPercentages(countByStreetMaterialDao.countByStreetMaterial());
    }

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
}