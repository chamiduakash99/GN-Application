package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Citizen;
import lk.earth.earthuniversity.entity.Landdetail;
import lk.earth.earthuniversity.entity.Street;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LanddetailDao extends JpaRepository<Landdetail,Integer> {

    Landdetail findByStreetAndCitizen(Street street, Citizen citizen);
}
