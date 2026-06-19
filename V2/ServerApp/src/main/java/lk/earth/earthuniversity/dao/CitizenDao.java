package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CitizenDao extends JpaRepository<Citizen, Integer> {

    // Custom query method to check existing NIC
    Citizen findByNic(String nic);

    Citizen findCitizenByBirthcetificateno(String birthcetificateno);
}
