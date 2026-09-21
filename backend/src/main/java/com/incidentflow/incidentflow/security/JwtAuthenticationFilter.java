package com.incidentflow.incidentflow.security;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService customUserDetailsService) {

        this.jwtService = jwtService;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String requestPath = request.getServletPath();

        if (requestPath.startsWith("/api/auth/")
                || requestPath.equals("/api/health")) {

            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println(
                    "JWT FILTER: No Bearer token for " + requestPath
            );

            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            String email = jwtService.extractEmail(token);

            System.out.println(
                    "JWT FILTER: Token email = " + email
            );

            if (email != null
                    && SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails =
                        customUserDetailsService.loadUserByUsername(email);

                boolean valid =
                        jwtService.isTokenValid(token, userDetails);

                System.out.println(
                        "JWT FILTER: Token valid = " + valid
                );

                if (valid) {

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);

                    System.out.println(
                            "JWT FILTER: Authentication SUCCESS - "
                                    + userDetails.getUsername()
                                    + " - authorities="
                                    + userDetails.getAuthorities()
                    );
                }
            }

        } catch (Exception ex) {
            System.out.println(
                    "JWT FILTER: AUTHENTICATION ERROR = "
                            + ex.getClass().getSimpleName()
                            + " - "
                            + ex.getMessage()
            );
        }

        filterChain.doFilter(request, response);
    }
}