package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Household;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HouseholdDao extends JpaRepository<Household, Integer> {

    @Query("select new Household(h.id, h.householdno) from Household h")
    List<Household> findAllNameId();

    @Query("select h from Household h where lower(h.householdno) like lower(concat('%', :householdno, '%'))")
    List<Household> findByHouseholdnoContaining(String householdno);

    @Query("select h from Household h where lower(h.address) like lower(concat('%', :address, '%'))")
    List<Household> findByAddressContaining(String address);
}