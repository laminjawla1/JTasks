package com.jgroup.jtasks.authorization.privileges;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/authorization/privileges")
public class PrivilegeController {

    private final PrivilegeService privilegeService;

    @GetMapping
    public ResponseEntity<List<PrivilegeResponse>> getPrivileges() {
        return ResponseEntity.ok(privilegeService.getPrivileges());
    }
}
