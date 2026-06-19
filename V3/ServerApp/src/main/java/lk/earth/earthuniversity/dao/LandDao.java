package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Citizen;
import lk.earth.earthuniversity.entity.Land;
import lk.earth.earthuniversity.entity.Street;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LandDao extends JpaRepository<Land, Integer> {


    Land findByStreetAndCitizen(Street street, Citizen citizen);



}
